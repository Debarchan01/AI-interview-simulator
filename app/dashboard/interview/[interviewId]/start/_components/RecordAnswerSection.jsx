"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Reset user answer state when new speech results are available
  useEffect(() => {
    if (results?.length > 0) {
      results.map((result) => {
        setUserAnswer((prevAns) => prevAns + result?.transcript);
      });
    }
  }, [results]);

  // Check and update answer once recording stops
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  // Toggle recording state
  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText(); // Stop recording
    } else {
      setUserAnswer(""); // Clear previous answer when starting a new one
      setResults([]); // Reset old speech results
      startSpeechToText(); // Start new recording
    }
  };

  // Function to update the user answer in the database after recording
  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. 
    Based on the question and user answer, give a JSON response with a rating and feedback in 3-5 lines for improvement.`;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    console.log(mockJsonResp);

    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format('DD-MM-YYYY'),
    });

    if (resp) {
      toast('User Answer recorded successfully');
      setResults([]); // Clear results after saving answer
      setUserAnswer(""); // Reset user answer state after recording
    }

    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={"/webcamlogo.png"} width={200} height={200} alt="webcam" className='absolute'/>
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <Button 
        disabled={loading}
        variant="outline" 
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? 
          <h2 className='text-red-600 flex gap-2'>
            <Mic/> Stop Recording
          </h2>
          : 
          "Record Answer"
        }
      </Button>
    </div>
  );
}

export default RecordAnswerSection;




