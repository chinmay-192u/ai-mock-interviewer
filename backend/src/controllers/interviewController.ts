import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Interview } from '../models/Interview.js';

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
    }).sort({ createdAt: -1 });

    return res.status(200).json({
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

import { generateInterviewQuestions } from '../services/aiService.js';

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
