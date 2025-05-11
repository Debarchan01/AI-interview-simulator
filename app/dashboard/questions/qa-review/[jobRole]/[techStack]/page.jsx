"use client";
import React, { useEffect, useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { db } from '@/utils/db';
import { CommonQuestions } from '@/utils/schema';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';

function QAReview() {
  const [qaList, setQaList] = useState([]);
  const router = useRouter();
  const { jobRole, techStack } = useParams(); // Expecting /qa-review/frontend/javascript

  useEffect(() => {
    if (jobRole && techStack) {
      fetchQuestions();
    }
  }, [jobRole, techStack]);

  const fetchQuestions = async () => {
    try {
      const result = await db.select()
        .from(CommonQuestions)
        .where(and(
          eq(CommonQuestions.jobRole, decodeURIComponent(jobRole)),
          eq(CommonQuestions.techStack, decodeURIComponent(techStack))
        ))
        .orderBy(CommonQuestions.id)
        .limit(20);

      setQaList(result || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const usableWidth = pageWidth - 2 * margin;

    doc.setFontSize(14); // Smaller title font
    doc.text(`Interview Q&A for ${decodeURIComponent(jobRole)} (${techStack})`, margin, 20);
    let yOffset = 30;

    qaList.forEach((item, index) => {
      const sections = [
        { label: "Question", content: item.question },
        { label: "Answer", content: item.answer }
      ];

      for (let section of sections) {
        doc.setFontSize(8); // Smaller content font
        const wrapped = doc.splitTextToSize(`${section.label}: ${section.content}`, usableWidth);
        if (yOffset + wrapped.length * 6 > 280) {
          doc.addPage();
          yOffset = 20;
        }
        doc.text(wrapped, margin, yOffset);
        yOffset += wrapped.length * 6;
      }

      yOffset += 5;
    });

    doc.save(`Interview_Questions_${jobRole}_${techStack}.pdf`);
  };

  return (
    <div className='p-10'>
      {qaList.length === 0 ? (
        <h2 className='font-bold text-xl text-gray-500'>No Questions Found for this Role & Tech Stack</h2>
      ) : (
        <>
          <h2 className='text-3xl font-bold text-green-500'>All the Best!</h2>
          <h2 className='font-bold text-2xl'>Top Interview Questions & Answers</h2>
          <h2 className='text-sm text-gray-500 mb-6'>Based on: <strong>{decodeURIComponent(jobRole)}</strong> role and <strong>{techStack}</strong> stack</h2>

          {qaList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
                <span className="text-left">{index + 1}. {item.question}</span>
                <ChevronsUpDown className='h-5 w-5' />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='p-3 border rounded-lg bg-green-50 text-green-900 text-sm'>
                  <strong>Answer:</strong> {item.answer}
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

export default QAReview;
