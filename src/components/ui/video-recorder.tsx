import React, { useState, useRef, useEffect } from 'react';
import { Video, CircleStop as StopCircle, Play, Upload, X } from 'lucide-react';
import { Button } from './button';
import { Progress } from './progress';
import { Alert, AlertDescription } from './alert';

interface VideoRecorderProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  maxDuration?: number;
  className?: string;
}

export const VideoRecorder: React.FC<VideoRecorderProps> = ({
  onVideoRecorded,
  maxDuration = 10,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stream]);

  const startRecording = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: true,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.muted = true;
      }

      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoBlob(blob);
        setIsPreviewing(true);

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.muted = false;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to access camera. Please grant permission and try again.');
      console.error('Error accessing media devices:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const handleRetake = () => {
    setVideoBlob(null);
    setIsPreviewing(false);
    setRecordingTime(0);
    if (videoRef.current) {
      videoRef.current.src = '';
    }
  };

  const handleUpload = () => {
    if (videoBlob) {
      onVideoRecorded(videoBlob);
    }
  };

  const progress = (recordingTime / maxDuration) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Recording {recordingTime}s / {maxDuration}s
          </div>
        )}
      </div>

      {isRecording && (
        <Progress value={progress} className="h-2" />
      )}

      <div className="flex gap-2 justify-center">
        {!isRecording && !isPreviewing && (
          <Button onClick={startRecording} size="lg">
            <Video className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button onClick={stopRecording} variant="destructive" size="lg">
            <StopCircle className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
        )}

        {isPreviewing && (
          <>
            <Button onClick={handleRetake} variant="outline" size="lg">
              <X className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button onClick={handleUpload} size="lg">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </Button>
          </>
        )}
      </div>

      {isPreviewing && (
        <p className="text-sm text-muted-foreground text-center">
          Preview your video and click Upload when ready
        </p>
      )}
    </div>
  );
};
