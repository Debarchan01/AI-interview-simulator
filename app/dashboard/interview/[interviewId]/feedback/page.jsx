"use client";
import { UserAnswer } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const router = useRouter();
  const { interviewId } = useParams();

  useEffect(() => {
    if (interviewId) {
      GetFeedback();
    } else {
      console.error("Interview ID not found");
    }
  }, [interviewId]);

  const GetFeedback = async () => {
    try {
      const result = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId))
        .orderBy(UserAnswer.id);

      if (result && result.length > 0) {
        setFeedbackList(result);
        calculateAverageRating(result);
      } else {
        setFeedbackList([]);
        setAverageRating(null);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setFeedbackList([]);
      setAverageRating(null);
    }
  };

  const calculateAverageRating = (feedbacks) => {
    const ratings = feedbacks.map(item => parseFloat(item.rating)).filter(r => !isNaN(r));
    const total = ratings.reduce((sum, val) => sum + val, 0);
    const avg = (ratings.length > 0) ? (total / ratings.length).toFixed(1) : null;
    setAverageRating(avg);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const usableWidth = pageWidth - 2 * margin;

    doc.setFontSize(18);
    doc.text("Interview Feedback Report", margin, 20);
    let yOffset = 30;

    if (averageRating) {
      doc.setFontSize(12);
      doc.text(`Overall Rating: ${averageRating}/10`, margin, yOffset);
      yOffset += 10;
    }

    feedbackList.forEach((item, index) => {
      doc.setFontSize(12);
      const sections = [
        { label: "Question", content: item.question },
        { label: "Your Answer", content: item.userAns },
        { label: "Correct Answer", content: item.correctAns },
        { label: "Feedback", content: item.feedback },
        { label: "Rating", content: item.rating }
      ];

      for (let section of sections) {
        const wrapped = doc.splitTextToSize(`${section.label}: ${section.content}`, usableWidth);
        if (yOffset + wrapped.length * 7 > 280) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(wrapped, margin, yOffset);
        yOffset += wrapped.length * 7;
      }

      yOffset += 5;
    });

    doc.save(`Interview_Feedback_${interviewId}.pdf`);
  };

  return (
    <div className='p-10'>
      {feedbackList?.length === 0 ? (
        <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
      ) : (
        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>
          <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

          {averageRating && (
            <h2 className='text-blue-500 text-lg my-3'>
              Your overall interview rating: <strong>{averageRating}/10</strong>
            </h2>
          )}

          <h2 className='text-sm text-gray-500'>Find below the interview question with correct answer, your answer and feedback for improvement</h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
                {item.question} <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                  <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
                  <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                  <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback: </strong>{item.feedback}</h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}

          <div className="flex mt-6">
            <Button onClick={generatePDF}>Download PDF</Button>
            <Button className="ml-4" onClick={() => router.replace('/dashboard')}>Go Home</Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Feedback;
