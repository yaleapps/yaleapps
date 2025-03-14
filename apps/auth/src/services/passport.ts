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

	// User to session
	passport.serializeUser((untypedUser, done) => {
		const user = untypedUser as User;
		const session = user.netId;
		done(null, session);
	});

	// Session to user
	passport.deserializeUser((session: string, done) => {
		const user = { netId: session } satisfies User;
		done(null, user);
	});
}
