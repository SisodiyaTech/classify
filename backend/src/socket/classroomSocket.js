export const setupClassroomSocket = (io) => {
  // Map of active rooms: batchId -> Set of connected sockets/users
  const activeRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join small-batch live classroom
    socket.on('join-classroom', ({ batchId, user }) => {
      socket.join(batchId);
      socket.batchId = batchId;
      socket.user = user;

      if (!activeRooms.has(batchId)) {
        activeRooms.set(batchId, new Map());
      }
      activeRooms.get(batchId).set(socket.id, user);

      const roomParticipants = Array.from(activeRooms.get(batchId).values());
      console.log(`[Classroom] ${user?.name || socket.id} joined batch ${batchId}. Total in cohort: ${roomParticipants.length}`);

      // Broadcast updated participant roster
      io.to(batchId).emit('participant-joined', {
        user,
        participants: roomParticipants,
      });
    });

    // Chat message in live classroom
    socket.on('send-message', (data) => {
      if (socket.batchId) {
        io.to(socket.batchId).emit('new-message', {
          id: `msg-${Date.now()}`,
          sender: socket.user?.name || 'Anonymous',
          senderAvatar: socket.user?.avatar,
          role: socket.user?.role || 'student',
          time: new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(new Date()),
          text: data.text,
        });
      }
    });

    // Raise / Lower hand in cohort
    socket.on('toggle-hand', ({ isHandRaised }) => {
      if (socket.batchId) {
        io.to(socket.batchId).emit('hand-toggled', {
          userId: socket.user?.id || socket.id,
          userName: socket.user?.name,
          isHandRaised,
        });
      }
    });

    // Screen sharing alert
    socket.on('screen-share-status', ({ isSharing }) => {
      if (socket.batchId) {
        socket.to(socket.batchId).emit('screen-share-changed', {
          userId: socket.user?.id || socket.id,
          userName: socket.user?.name,
          isSharing,
        });
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      if (socket.batchId && activeRooms.has(socket.batchId)) {
        activeRooms.get(socket.batchId).delete(socket.id);
        const remaining = Array.from(activeRooms.get(socket.batchId).values());
        io.to(socket.batchId).emit('participant-left', {
          userId: socket.user?.id || socket.id,
          participants: remaining,
        });
      }
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

export default setupClassroomSocket;
