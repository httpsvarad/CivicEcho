import { Comment } from '../types';

export function parseCSV(csvText: string): Comment[] {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const comments: Comment[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    if (values.length >= 2) {
      const comment: Comment = {
        Comment_ID: parseInt(values[0]) || i,
        Comment: values.slice(1).join(',').trim() // Handle commas within comments
      };
      
      comments.push(comment);
    }
  }
  
  return comments;
}

export const mockData: Comment[] = [
  { Comment_ID: 1, Comment: "The proposed amendment is very useful and will simplify compliance." },
  { Comment_ID: 2, Comment: "This draft legislation is unclear and creates confusion for stakeholders." },
  { Comment_ID: 3, Comment: "Overall it is fine, but some clauses need more clarification." },
  { Comment_ID: 4, Comment: "The amendment will increase unnecessary burden on small businesses." },
  { Comment_ID: 5, Comment: "Excellent step towards improving transparency." },
  { Comment_ID: 6, Comment: "The draft should consider global best practices before finalisation." },
  { Comment_ID: 7, Comment: "This will complicate the filing process further, not a good idea." },
  { Comment_ID: 8, Comment: "Very well drafted and covers all necessary aspects." },
  { Comment_ID: 9, Comment: "Some provisions are redundant and must be removed." },
  { Comment_ID: 10, Comment: "Positive move, but implementation guidelines are missing." }
];