import Head from "next/head";
import { signIn, getSession } from "next-auth/react";
import { hashPassword } from "../lib/auth";

export default function Login() {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email: event.target.email.value,
            password: event.target.password.value,
        });

        if (!result.error) {
            // Redirect based on isAdmin flag in session
            const { user } = await getSession();
            // console.log(JSON.stringify(await getSession()))
            window.location.href = user.isAdmin ? "/admin" : "/";
        } else {
            // Handle errors
            console.error(result.error);
        }
    };

    const handlePasswordHashing = async (event) => {
        event.preventDefault();
        console.log(await hashPassword(event.target.password.value));
    };

    return (
        <>
            <Head>
                <title>JaydenTV Mall</title>
                <meta name="description" content="1155176645 IERG4210" />
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <main>
                <header>
                    <div className="title">
                        <h1>JAYDENTV MALL - LOGIN</h1>
                    </div>
                </header>
                <div>
                    <div className="login-form">
                        <form onSubmit={handleSubmit}>
                            <fieldset>
                                <h3>Login</h3>
                                <div className="email">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" id="eamil" required />
                                </div>
                                <div className="password">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" id="password" required />
                                </div>
                                <br />
                                <button type="submit">Submit</button>
                            </fieldset>
                        </form>
                    </div>
                    {/* <div>
                        <form onSubmit={handlePasswordHashing}>
                            <fieldset>
                                <h3>Check Password</h3>
                                <div className="password">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" name="password" id="password" required />
                                </div>
                                <br />
                                <button type="submit">Submit</button>
                            </fieldset>
                        </form>
                    </div> */}
                </div>
            </main>
        </>
    )
}