"use client";

import { useState, useTransition } from "react";

import { createQuiz } from "../services/QuizCreationService";
import type {
  QuizCreationCategory,
  QuizCreationFormInput,
  QuizCreationFormOption,
  QuizCreationFormQuestion,
  QuizCreationVisibility,
} from "../types/QuizCreationType";

function createId() {
  return crypto.randomUUID();
}

function createOption(isCorrect = false): QuizCreationFormOption {
  return { id: createId(), content: "", isCorrect };
}

function createQuestion(): QuizCreationFormQuestion {
  return {
    id: createId(),
    content: "",
    options: [createOption(true), createOption()],
  };
}

function initialFormInput(): QuizCreationFormInput {
  return {
    title: "",
    description: "",
    category: "general",
    visibility: "public",
    secretCode: "",
    questions: [createQuestion()],
    error: null,
    status: "idle",
    result: null,
  };
}

export function useQuizCreationHook() {
  const [formInput, setFormInput] = useState<QuizCreationFormInput>(initialFormInput);
  const [isPending, startTransition] = useTransition();

  const clearError = () => {
    setFormInput((previous) => ({ ...previous, error: null, status: "idle" }));
  };

  const updateTextField = (field: "title" | "description" | "secretCode", value: string) => {
    setFormInput((previous) => ({ ...previous, [field]: value, error: null, status: "idle" }));
  };

  const updateCategory = (category: QuizCreationCategory) => {
    setFormInput((previous) => ({ ...previous, category, error: null, status: "idle" }));
  };

  const updateVisibility = (visibility: QuizCreationVisibility) => {
    setFormInput((previous) => ({
      ...previous,
      visibility,
      secretCode: visibility === "public" ? "" : previous.secretCode,
      error: null,
      status: "idle",
    }));
  };

  const updateQuestionContent = (questionId: string, content: string) => {
    setFormInput((previous) => ({
      ...previous,
      error: null,
      status: "idle",
      questions: previous.questions.map((question) =>
        question.id === questionId ? { ...question, content } : question
      ),
    }));
  };

  const updateOptionContent = (questionId: string, optionId: string, content: string) => {
    setFormInput((previous) => ({
      ...previous,
      error: null,
      status: "idle",
      questions: previous.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) =>
                option.id === optionId ? { ...option, content } : option
              ),
            }
          : question
      ),
    }));
  };

  const selectCorrectOption = (questionId: string, optionId: string) => {
    setFormInput((previous) => ({
      ...previous,
      error: null,
      status: "idle",
      questions: previous.questions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option) => ({
                ...option,
                isCorrect: option.id === optionId,
              })),
            }
          : question
      ),
    }));
  };

  const addQuestion = () => {
    setFormInput((previous) => ({
      ...previous,
      error: null,
      status: "idle",
      questions: [...previous.questions, createQuestion()],
    }));
  };

  const removeQuestion = (questionId: string) => {
    setFormInput((previous) => {
      if (previous.questions.length === 1) return previous;
      return {
        ...previous,
        error: null,
        status: "idle",
        questions: previous.questions.filter((question) => question.id !== questionId),
      };
    });
  };

  const addOption = (questionId: string) => {
    setFormInput((previous) => ({
      ...previous,
      error: null,
      status: "idle",
      questions: previous.questions.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, createOption()] }
          : question
      ),
    }));
  };

  const removeOption = (questionId: string, optionId: string) => {
    setFormInput((previous) => ({
      ...previous,
      error: null,
      status: "idle",
      questions: previous.questions.map((question) => {
        if (question.id !== questionId || question.options.length === 2) return question;

        const nextOptions = question.options.filter((option) => option.id !== optionId);
        return {
          ...question,
          options: nextOptions.some((option) => option.isCorrect)
            ? nextOptions
            : nextOptions.map((option, index) => ({ ...option, isCorrect: index === 0 })),
        };
      }),
    }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormInput((previous) => ({ ...previous, error: null, status: "pending" }));

    startTransition(async () => {
      const result = await createQuiz({
        title: formInput.title,
        description: formInput.description,
        category: formInput.category,
        visibility: formInput.visibility,
        ...(formInput.visibility === "private" ? { secretCode: formInput.secretCode } : {}),
        questions: formInput.questions.map((question) => ({
          content: question.content,
          options: question.options.map(({ content, isCorrect }) => ({ content, isCorrect })),
        })),
      });

      if (result.status === "error") {
        setFormInput((previous) => ({ ...previous, error: result.error, status: "error" }));
        return;
      }

      setFormInput((previous) => ({
        ...previous,
        error: null,
        status: "success",
        result,
      }));
    });
  };

  return {
    formInput,
    isPending,
    updateTextField,
    updateCategory,
    updateVisibility,
    updateQuestionContent,
    updateOptionContent,
    selectCorrectOption,
    addQuestion,
    removeQuestion,
    addOption,
    removeOption,
    clearError,
    submit,
  };
}
