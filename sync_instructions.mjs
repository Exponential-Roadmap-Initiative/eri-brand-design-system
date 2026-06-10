import { createConnection } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

config();

const instructionsText = readFileSync('/home/ubuntu/project_instructions_text.txt', 'utf8').trim();
const agentNote = 'Synced by agent on 2026-06-10';

const conn = await createConnection(process.env.DATABASE_URL);

try {
  await conn.execute(
    `INSERT INTO current_instructions_sync (id, instructions_text, agent_note, synced_at)
     VALUES (1, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
       instructions_text = VALUES(instructions_text),
       agent_note = VALUES(agent_note),
       synced_at = NOW()`,
    [instructionsText, agentNote]
  );
  console.log('✓ Instructions synced successfully');
  console.log('  Length:', instructionsText.length, 'chars');
} finally {
  await conn.end();
}
