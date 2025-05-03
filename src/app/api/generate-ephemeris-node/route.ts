import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  // Accept JSON body from frontend
  const birthData = await req.json();

  return new Promise((resolve) => {
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
      py.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(NextResponse.json(JSON.parse(result)));
          } catch (e) {
            resolve(NextResponse.json({ error: 'Failed to parse Python output', details: result }, { status: 500 }));
          }
        } else {
          resolve(NextResponse.json({ error: 'Python script error', details: errResult }, { status: 500 }));
        }
      });
      py.stdin.write(input);
      py.stdin.end();
    } catch (e) {
      resolve(NextResponse.json({ error: 'Server error', details: (e instanceof Error ? e.message : String(e)) }, { status: 500 }));
    }
  });
}
