import { pgTable,serial,text,varchar,integer } from "drizzle-orm/pg-core";

export const MockInterview=pgTable('MockInterview',{
  id:serial('id').primaryKey(),
  jsonMockResp:text('jsonMockResp').notNull(),
  jobPosition:varchar('jobPosition').notNull(),
  jobDesc:varchar('jobDesc').notNull(),
  jobExperience:varchar('jobExperience').notNull(),
  createdBy:varchar('createdBy').notNull(),
  createdAt:varchar('createdAt').notNull(),
  mockId:varchar('mockId').notNull()
})

export const UserAnswer=pgTable('userAnswer',{
  id:serial('id').primaryKey(),
  mockIdRef:varchar('mockId').notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating:varchar('rating'),
  userEmail:varchar('userEmail'),
  createdAt:varchar('cretedAt')
})



export const CommonQuestions = pgTable('common_questions', {
  id: serial('id').primaryKey(),
  jobRole: varchar('jobRole').notNull(),
  techStack: text('techStack').notNull(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  createdAt: varchar('createdAt').notNull(),
});

