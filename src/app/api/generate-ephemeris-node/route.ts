import type { NextRequest } from 'next/server';
import { spawn } from 'child_process';

export const segmentConfig = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export async function POST(req: NextRequest) {
  if (req.method && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Accept JSON body from frontend
  const birthData = await req.json();

  try {
    const py = spawn('python', ['astro_sweph_api.py'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const input = JSON.stringify(birthData);
    let result = '';
    let errResult = '';
    py.stdout.on('data', (data) => { result += data.toString(); });
    py.stderr.on('data', (err) => { errResult += err.toString(); });
    return await new Promise((resolve) => {
      py.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(new Response(result, { status: 200, headers: { 'Content-Type': 'application/json' } }));
          } catch (e) {
            resolve(new Response(JSON.stringify({ error: 'Failed to parse Python output', details: result }), { status: 500 }));
          }
        } else {
          resolve(new Response(JSON.stringify({ error: 'Python script error', details: errResult }), { status: 500 }));
        }
      });
      py.stdin.write(input);
      py.stdin.end();
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Server error', details: e.message }), { status: 500 });
  }
}
