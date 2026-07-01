export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    const url = new URL(request.url);
    
    if (url.pathname === '/chat') {
      return handleChat(request, env);
    }
    if (url.pathname === '/compile') {
      return handleCompile(request, env);
    }

    return new Response('Not found', { status: 404 });
  }
};

async function handleChat(request, env) {
  try {
    const body = await request.json();
    const { messages, license_key } = body;

    // Verify pro license via Gumroad
    if (license_key) {
      const licResp = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'product_id=' + encodeURIComponent('-HF9Pm7TTWGckNpQQJfenw==') + '&license_key=' + encodeURIComponent(license_key)
      });
      const licData = await licResp.json();
      if (!licData.success || !licData.purchase || licData.purchase.refunded) {
        return new Response(JSON.stringify({ error: 'Invalid license' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    const systemPrompt = `You are an AI assistant that helps Arizona ESA homeschool parents write Parent-Provided Curriculums (PPCs). 

Your job is to gather information through natural conversation and guide them to a complete PPC.

Ask one question at a time. Be warm and encouraging — parents are often anxious about ESA audits.

The information you need to gather:
1. Student name and ESA application ID
2. Course title and subject
3. Grade level
4. Duration (weeks or semester)
5. Scope — what the course covers (narrative paragraph)
6. Learning objectives (3-5 measurable goals)
7. Materials list with prices and educational justifications
8. Lesson plan (3 units with weeks, activities, and goals)
9. Why this course is necessary for their homeschool

Keep responses concise. When you have enough information, say "I have enough to compile your PPC. Type **compile** when you're ready."`;

    const model = '@hf/google/gemma-2-9b-it';
    const result = await env.AI.run(model, {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      stream: true,
      max_tokens: 1024
    });

    return new Response(result, {
      headers: { 'Content-Type': 'text/event-stream', ...corsHeaders() }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

async function handleCompile(request, env) {
  try {
    const body = await request.json();
    const { conversation, license_key } = body;

    // Verify license
    if (license_key) {
      const licResp = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'product_id=' + encodeURIComponent('-HF9Pm7TTWGckNpQQJfenw==') + '&license_key=' + encodeURIComponent(license_key)
      });
      const licData = await licResp.json();
      if (!licData.success || !licData.purchase || licData.purchase.refunded) {
        return new Response(JSON.stringify({ error: 'Invalid license' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
      }
    }

    const conversationText = conversation
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const compilePrompt = `Based on the following conversation with an Arizona ESA parent, generate a complete Parent-Provided Curriculum (PPC) in the standard format below. Fill in any missing details with reasonable defaults based on the conversation context.

CONVERSATION:
${conversationText}

Return the PPC in this exact format:

Course of Study: [Title]
Student Name: [name]
Student Application ID#: [ID]
Subject Category: [subject] / [grade]
Duration: [duration]

Scope of Study
[Narrative paragraph describing the course]

Key Learning Objectives:
• [Topic:] [Objective]
• [Topic:] [Objective]

Materials List & Educational Justification
• [Item] ($price)
  [Educational justification]

Weekly Sequence of Lessons
Unit 1 (Weeks X-Y): [Title]
[Activities]
Goal/Task: [deliverable]

Unit 2 (Weeks X-Y): [Title]
[Activities]
Goal/Task: [deliverable]

Unit 3 (Weeks X-Y): [Title]
[Activities]
Goal/Task: [deliverable]

Why This is Necessary for Homeschooling
[Justification paragraph]

This Parent-Provided Curriculum was prepared in accordance with A.R.S. §15-2402.
ESA Program — School Year 2025-2026`;

    const model = '@hf/google/gemma-2-9b-it';
    const result = await env.AI.run(model, {
      messages: [
        { role: 'user', content: compilePrompt }
      ],
      max_tokens: 2048
    });

    return new Response(JSON.stringify({ ppc: result.response }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
