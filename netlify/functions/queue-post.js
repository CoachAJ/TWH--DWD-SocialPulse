exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { post } = JSON.parse(event.body);

    if (!post || !post.content || !post.platform) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid post data' }),
      };
    }

    // In production, you would save to a database
    // For demo, we'll simulate storage and return success

    const queuedPost = {
      id: post.id || Date.now().toString(),
      content: post.content,
      platform: post.platform,
      topic: post.topic || '',
      tone: post.tone || 'professional',
      scheduledFor: post.scheduledFor || new Date().toISOString(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      createdBy: post.createdBy || 'demo-user',
    };

    // In production: await db.collection('posts').insertOne(queuedPost);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Post queued successfully',
        post: queuedPost,
      }),
    };
  } catch (error) {
    console.error('Queue post error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
