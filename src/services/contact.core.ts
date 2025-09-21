import axios from "axios"
import { CoreResponse } from "../types/@types.core";
import { handleOnlyDataCore } from "../utils/handleCoreResponse";

type MessagePayload = {
  email: string;
  firstName: string;
  lastName: string;
  message: string;
  isChecked: boolean;
};

/* --- Utilitaire pour construire l'embed Discord --- */
const buildDiscordEmbed = ({ email, firstName, lastName, message, isChecked }: MessagePayload) => ({
  embeds: [
    {
      title: "NEW INCOMING MESSAGE",
      description: `\`\`\`${message}\`\`\``,
      color: 15715212,
      fields: [
        { name: "🦑 Prénom", value: `\`\`\`${firstName}\`\`\``, inline: true },
        { name: "🐙 Nom", value: `\`\`\`${lastName}\`\`\``, inline: true },
        { name: "🪪 Email", value: `\`\`\`${email}\`\`\`` },
      ],
      footer: { text: `🤖 valid privacy : ${isChecked}` },
      timestamp: new Date().toISOString(),
    },
  ],
});

/* --- Core function --- */
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

export const newMessagePostCore = async (payload: MessagePayload): CoreResponse<string> => {
  const data = buildDiscordEmbed(payload);
  return handleOnlyDataCore(
    () => axios.post(DISCORD_WEBHOOK_URL!, data, {
      headers: { "Content-Type": "application/json" },
    }).then(() => "Message envoyé"), {} , "contact", "newMessagePostCore"
  )
};