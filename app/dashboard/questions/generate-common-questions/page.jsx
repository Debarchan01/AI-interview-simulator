"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { CommonQuestions } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function GenerateCommonQuestions() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [techStack, setTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `
You are an expert HR interviewer. 
Given the following:
- Job Position: ${jobPosition}
- Tech Stack: ${techStack}
Generate ${20} commonly asked interview questions in JSON format with each having a 'question' and an 'answer' field.
Return JSON only, no explanation or markdown.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const cleaned = result.response.text().replace('```json', '').replace('```', '');
      const parsed = JSON.parse(cleaned);

      // Insert each question-answer pair as a row
      for (const item of parsed) {
        await db.insert(CommonQuestions).values({
          jobRole: jobPosition,
          techStack: techStack,
          question: item.question,
          answer: item.answer,
          createdAt: moment().format("DD-MM-YYYY"),
        });
      }

      setOpenDialog(false);
      router.push(`/dashboard/questions/qa-review/${encodeURIComponent(jobPosition)}/${encodeURIComponent(techStack)}`);
    } catch (error) {
      console.error("Failed to generate or save questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}>
        <h2 className="font-bold text-lg text-center">+ Generate Common Questions</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Generate Common Interview Questions</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="mt-7 my-3">
                  <label>Job Role/Position</label>
                  <Input
                    placeholder="Ex. Frontend Developer"
                    required
                    onChange={(event) => setJobPosition(event.target.value)}
                  />
                </div>

                <div className="my-3">
                  <label>Tech Stack</label>
                  <Textarea
                    placeholder="Ex. React, Node.js, MongoDB"
                    required
                    onChange={(event) => setTechStack(event.target.value)}
                  />
                </div>

                <div className="flex gap-5 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" className="bg-blue-400 hover:bg-blue-500" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating...
                      </>
                    ) : (
                      "Generate"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GenerateCommonQuestions;
