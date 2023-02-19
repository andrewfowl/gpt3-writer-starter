import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `
Write me a detailed table of contents for a blog post with the title below.

Title:
`;

const basePromptSuffix = `
\n\n\n\n###
`;

const modelChoice = `davinci:ft-kabeiri-2023-02-19-04-42-35`
//standard model is 'text-davinci-003'
//goes in-depth on the topic and shows that the writer did their research.
const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}${basePromptSuffix}`)

  const baseCompletion = await openai.createCompletion({
    model: `${modelChoice}`,
    prompt: `${basePromptPrefix}${req.body.userInput}${basePromptSuffix}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  `
  Take the table of contents and title of the blog post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the points. Go deep into each one. Explain why.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Blog Post:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: `${modelChoice}`,
    prompt: `${secondPrompt}${basePromptSuffix}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
		// I also increase max_tokens.
    max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;