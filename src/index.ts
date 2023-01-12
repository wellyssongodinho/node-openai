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