import Talk from "talkjs";
import { useEffect, useState, useRef } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function ChatComponent({ id }: { id: string }) {
	const chatboxEl = useRef<HTMLDivElement | null>(null);
	const { user, error, isLoading } = useUser();

	// wait for TalkJS to load
	const [talkLoaded, markTalkLoaded] = useState(false);

	useEffect(() => {
		Talk.ready.then(() => markTalkLoaded(true));

		if (talkLoaded && chatboxEl.current && !isLoading) {
			const currentUser = new Talk.User({
				id: user?.sub ?? "",
				name: user?.name ?? "",
				email: user?.email ?? "",
				photoUrl: user?.picture ?? "",
				role: "default",
			});

			const session = new Talk.Session({
				appId: "tSC5Z6g6",
				me: currentUser,
			});

			const conversation = session.getOrCreateConversation(id);
			conversation.setParticipant(currentUser);

			const chatbox = session.createChatbox();
			chatbox.select(conversation);
			chatbox.mount(chatboxEl.current);

			return () => session.destroy();
		}
	}, [talkLoaded, chatboxEl.current, isLoading]);

	return <div className='h-[700px] ' ref={chatboxEl} />;
}
