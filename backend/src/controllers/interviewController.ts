import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Interview } from '../models/Interview.js';
import {
  generateInterviewQuestions,
  evaluateInterview as evaluateInterviewAI,
} from '../services/aiService.js';

export const createInterview = async (req: Request, res: Response) => {
  try {
    const { role, difficulty, questions } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({
        message: 'Role and difficulty are required',
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const interview = await Interview.create({
      userId: new Types.ObjectId(req.userId),
      role,
      difficulty,
      questions: questions || [],
    });

    return res.status(201).json({
      message: 'Interview created successfully',
      interview,
    });
  } catch (error) {
    console.error('Create interview error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const getInterviews = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const interviews = await Interview.find({
      userId: req.userId,
    })
      .select('role difficulty score createdAt updatedAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error('Get interviews error:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getInterview = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Interview ID is required',
      });
    }

    const interview = await Interview.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      interview,
    });
  } catch (error) {
    console.error('Get interview error:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export const deleteInterview = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Interview ID is required',
      });
    }

    const interview = await Interview.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    console.error('Delete interview error:', error);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

export const generateInterview = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }
    const { role, difficulty, count } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({
        message: 'Role and difficulty are required',
      });
    }

    const questions = await generateInterviewQuestions(role, difficulty, count || 5);

    const interview = await Interview.create({
      userId: req.userId,
      role,
      difficulty,
      questions,
    });

    return res.status(201).json({
      message: 'Interview generated successfully',
      interview,
    });
  } catch (error) {
    console.error('AI generation error:', error);

    return res.status(500).json({
      message: 'Failed to generate interview questions',
    });
  }
};

export const submitAnswer = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const { questionId, answer } = req.body;

    if (!questionId || !answer) {
      return res.status(400).json({
        message: 'Question ID and answer are required',
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Interview ID is required',
      });
    }

    const interview = await Interview.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    const question = interview.questions.find((q) => q._id?.toString() === questionId);

    if (!question) {
      return res.status(404).json({
        message: 'Question not found',
      });
    }

    question.answer = answer;

    await interview.save();

    return res.status(200).json({
      message: 'Answer submitted successfully',
      question,
    });
  } catch (error) {
    console.error('Submit answer error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export const evaluateInterview = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Not authorized',
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Interview ID is required',
      });
    }

    // Find interview and make sure it belongs to the logged-in user
    const interview = await Interview.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    // Make sure the candidate has answered the questions
    const unansweredQuestions = interview.questions.filter((question) => !question.answer);

    if (unansweredQuestions.length > 0) {
      return res.status(400).json({
        message: 'Please answer all questions before evaluating the interview',
        unanswered: unansweredQuestions.length,
      });
    }

    // Send questions and answers to Gemini
    const evaluation = await evaluateInterviewAI(
      interview.role,
      interview.difficulty,
      interview.questions
    );

    // Save individual scores and feedback
    evaluation.evaluations.forEach(
      (result: { questionNumber: number; score: number; feedback: string }) => {
        const questionIndex = result.questionNumber - 1;

        if (interview.questions[questionIndex]) {
          interview.questions[questionIndex].score = result.score;
          interview.questions[questionIndex].feedback = result.feedback;
        }
      }
    );

    // Save overall score
    interview.score = evaluation.overallScore;
    interview.overallFeedback = evaluation.overallFeedback;

    await interview.save();

    return res.status(200).json({
      message: 'Interview evaluated successfully',
      result: {
        interviewId: interview._id,
        score: evaluation.overallScore,
        overallFeedback: evaluation.overallFeedback,
        questions: interview.questions,
      },
    });
  } catch (error) {
    console.error('Evaluate interview error:', error);

    return res.status(500).json({
      message: 'Failed to evaluate interview',
    });
  }
};
