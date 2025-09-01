import { useEffect, useRef, useState } from 'react';
import { getFirestore } from 'firebase-admin/firestore';

interface TelemedicineSession {
  sessionId: string;
  doctorId: string;
  patientId: string;
  startTime: Date;
  endTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

export const useTelemedicine = (sessionId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        // Initialize WebRTC peer connection
        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add TURN servers for production
          ],
        });
        peerConnection.current = pc;

        // Add local stream to peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle incoming stream
        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        // Set up signaling
        setupSignaling(sessionId, pc);

      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize telemedicine session'));
      }
    };

    initializeSession();

    return () => {
      // Cleanup
      localStream?.getTracks().forEach(track => track.stop());
      peerConnection.current?.close();
    };
  }, [sessionId]);

  return { localStream, remoteStream, error };
};

const setupSignaling = (sessionId: string, peerConnection: RTCPeerConnection) => {
  const db = getFirestore();
  const sessionRef = db.collection('telemedicine_sessions').doc(sessionId);

  // Listen for remote session description
  sessionRef.collection('signaling').doc('offer').onSnapshot(async (snapshot) => {
    if (snapshot.exists) {
      const { sdp } = snapshot.data()!;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
      
      // Create and send answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      await sessionRef.collection('signaling').doc('answer').set({
        sdp: answer,
        timestamp: new Date(),
      });
    }
  });

  // Handle ICE candidates
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await sessionRef.collection('signaling').doc('ice').set({
        candidate: event.candidate.toJSON(),
        timestamp: new Date(),
      });
    }
  };
};
