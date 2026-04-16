import axios from "axios"

/*
askAi():

* messages (prompt) validate karta hai (empty na ho)
* OpenRouter API ko POST request bhejta hai (model + messages)
* headers me API key use karke authenticate karta hai
* response me se AI ka actual content extract karta hai
* agar empty response ho → error throw
* final AI output return karta hai
* error aane par log + generic error throw

FLOW: validate → API call → extract → check → return → handle error
*/


export const askAi = async (messages) => {
    try {
        if(!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error("Messages array is empty.");
        }
        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4o-mini",
                messages: messages

            },
            {
            headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },});

        const content = response?.data?.choices?.[0]?.message?.content;

        if (!content || !content.trim()) {
      throw new Error("AI returned empty response.");
    }

    return content
    } catch (error) {
            console.error("OpenRouter Error:", error.response?.data || error.message);
    throw new Error("OpenRouter API Error");

    }
}