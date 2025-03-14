import passport from "passport";
import { Strategy as CasStrategy } from "@coursetable/passport-cas";

type User = { netId: string };

function setupPassport() {
	passport.use(
		new CasStrategy(
			{ version: "CAS2.0", ssoBaseURL: "https://secure.its.yale.edu/cas" },
			async ({ user: netId }, done) => {
				const user = { netId } satisfies User;
				return done(null, user);
			},
		),
	);

	/**
	 * Wraps passport.serializeUser and passport.deserializeUser with type safety
	 * @param serialize - Function to serialize user to session
	 * @param deserialize - Function to deserialize session to user
	 */
	const setupPassportSerializeDeserialize = <
		User extends Express.User,
		Session extends string,
	>(
		serialize: (user: User) => Session,
		deserialize: (session: Session) => User,
	) => {
		passport.serializeUser((user, done) => {
			const session = serialize(user as User);
			done(null, session);
		});
		passport.deserializeUser((session, done) => {
			const user = deserialize(session as Session);
			done(null, user);
		});
	};

	setupPassportSerializeDeserialize<User, string>(
		(user) => user.netId,
		(session) => ({ netId: session }) satisfies User,
	);
}
