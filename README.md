# How to connect ChatGPT with NodeJS

The application of OpenAI is ChatGPT. You can ask to it whatever you wish. Of course, it can’t answer all questions and has no idea about the future just like Google. But it can write poems, and offer some options depending on your questions.

## Installation OpenAI

Env And the openAI package:

```bash
npm install openai dotenv apollo-server
```

Create an [OpenAI](https://openai.com/) account e generated API Key

Create .env file and add the OPENAI_API_KEY environment variable:

```bash
touch .env
```

And I add the codes below to the index.ts file:

```javascript
import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const typeDefs = `
    type Query{
        ask_AQuestion(question:String):String
    }
`;

const resolvers = {
  Query: {
    ask_AQuestion: async (_: any, args: any, context: any) => {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const openai = new OpenAIApi(configuration);

      const completion = openai.createCompletion({
        model: "text-davinci-003",
        prompt: args.question,
        max_tokens: 1000,
      });

      let theAnswer;
      await completion.then(async (r) => {
        theAnswer = await r.data.choices[0].text;
        console.info(r.data.choices[0].text);
      });

      return theAnswer;
    },
  },
};

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  context: ({ req }: { req: any }) => {
    const token = req.headers.authorization || "";
    //console.log("authorization: " + token)
    return { token };
  },
});

server.listen({ port: PORT }).then(() => {
  console.log('OpenAI:',process.env.OPENAI_API_KEY);
  console.log(`🚀  Server ready at http://localhost:${PORT}`);
});
```

## Run your application

`npm start`

Access [http://localhost:5000/](http://localhost:5000/) and execute the query:

```json
{
  "question": "What is ChatGPT?"
}
```

### Initialize GIT

Create .gitignore file:

```bash
touch .gitignore
```

Type:

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependency directories
node_modules/

# Lock files
package-lock.json
yarn.lock

# local env files
.env
```

```bash
git init
```
