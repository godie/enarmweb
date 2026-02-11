import { useActionState, startTransition } from "react";
import CustomButton from "../custom/CustomButton";
import CustomRow from "../custom/CustomRow";
import CustomCol from "../custom/CustomCol";
import CustomTextInput from "../custom/CustomTextInput";
import CustomIcon from "../custom/CustomIcon";
import "./AuthForm.css";

const AuthForm = ({
    title,
    action,
    isSignup = false,
    onToggleSignup = null,
    extraContent = null,
    submitText = "Entrar",
    isPendingText = "Entrando...",
    layout = "default",
}) => {
    const [error, submitAction, isPending] = useActionState(action, null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
            submitAction(formData);
        });
    };

    const errorBlock = error && (
        <p className="red-text center-align valign-wrapper" role="alert" aria-live="assertive" style={{ justifyContent: "center" }}>
            <CustomIcon tiny className="red-text">highlight_off</CustomIcon>
            <span className="ml-2">{error}</span>
        </p>
    );

    const registerLink = onToggleSignup && (
        <p className="login-card-register center-align grey-text text-darken-2 mt-5">
            {isSignup ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
            <button
                type="button"
                className="login-card-register-link green-text text-darken-2"
                onClick={onToggleSignup}
            >
                {isSignup ? "Entra aquí" : "Regístrate aquí"}
            </button>
        </p>
    );

    if (layout === "card") {
        return (
            <div className="login-page green darken-1">
                <div className="login-page-shell">
                    <header className="login-page-branding white-text">
                        <h1 className="login-page-title">ENARM</h1>
                        <p className="login-page-tagline">Prepárate para el éxito</p>
                    </header>
                    <section className="login-page-card card z-depth-2">
                    <div className="card-content">
                        <form onSubmit={handleSubmit} className="login-card-form">
                            <h4 className="grey-text text-darken-3 center-align login-card-heading">{title}</h4>
                            {isSignup && (
                                <>
                                    <CustomTextInput
                                        label="Nombre Completo"
                                        id="name"
                                        name="name"
                                        icon="person_outline"
                                        iconClassName="grey-text text-darken-2"
                                        validate
                                        required
                                    />
                                    <CustomTextInput
                                        label="Usuario"
                                        id="username"
                                        name="username"
                                        icon="badge"
                                        iconClassName="grey-text text-darken-2"
                                        validate
                                        required
                                    />
                                </>
                            )}
                            <CustomTextInput
                                label={isSignup ? "Email" : "Email o Usuario"}
                                id="email"
                                name="email"
                                type={isSignup ? "email" : "text"}
                                placeholder="tu@email.com"
                                icon="mail_outline"
                                iconClassName="grey-text text-darken-2"
                                validate
                                required
                            />
                            <CustomTextInput
                                type="password"
                                label="Contraseña"
                                id="password"
                                name="password"
                                autocomplete={isSignup ? "new-password" : "current-password"}
                                icon="lock_outline"
                                iconClassName="grey-text text-darken-2"
                                passwordToggle
                                validate
                                required
                            />
                            {errorBlock}
                            <div className="center btn-brand mt-5">
                                <CustomButton
                                    type="submit"
                                    large
                                    waves="light"
                                    className="white-text text"
                                    isPending={isPending}
                                    isPendingText={isPendingText}
                                >
                                    {submitText}
                                </CustomButton>
                            </div>
                            {registerLink}
                            {extraContent}
                        </form>
                    </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="section green darken-1 ">
            <CustomRow className="z-depth-3 green container">
                <form onSubmit={handleSubmit} className="col s12 m12">
                    <h2 className="center white-text hide-on-small-only">{title}</h2>
                    <h4 className="center white-text hide-on-med-and-up">{title}</h4>
                    <CustomRow>
                        {isSignup && (
                            <>
                                <CustomCol s={12} m={10} l={8} offset="m1 l2">
                                    <CustomTextInput
                                        icon="person"
                                        iconClassName="white-text"
                                        label="Nombre Completo"
                                        id="name"
                                        name="name"
                                        inputClassName="white-text"
                                        validate
                                        required
                                    />
                                </CustomCol>
                                <CustomCol s={12} m={10} l={8} offset="m1 l2">
                                    <CustomTextInput
                                        icon="account_circle"
                                        iconClassName="white-text"
                                        label="Usuario"
                                        id="username"
                                        name="username"
                                        inputClassName="white-text"
                                        validate
                                        required
                                    />
                                </CustomCol>
                            </>
                        )}
                        <CustomCol s={12} m={10} l={8} offset="m1 l2">
                            <CustomTextInput
                                icon={isSignup ? "email" : "person"}
                                iconClassName="white-text"
                                label={isSignup ? "Email" : "Email o Usuario"}
                                id="email"
                                name="email"
                                type={isSignup ? "email" : "text"}
                                inputClassName="white-text"
                                validate
                                required
                            />
                        </CustomCol>
                        <CustomCol s={12} m={10} l={8} offset="m1 l2">
                            <CustomTextInput
                                icon="lock"
                                iconClassName="white-text"
                                type="password"
                                label="Contraseña"
                                id="password"
                                name="password"
                                autocomplete={isSignup ? "new-password" : "current-password"}
                                inputClassName="white-text"
                                validate
                                required
                            />
                        </CustomCol>
                    </CustomRow>
                    {errorBlock}
                    <CustomRow className="section center">
                        <CustomCol s={12} m={10} l={8} offset="m1 l2">
                            <CustomButton
                                type="submit"
                                large
                                waves="light"
                                className="grey lighten-3 green-text"
                                isPending={isPending}
                                isPendingText={isPendingText}
                                pendingColor="green"
                            >
                                {submitText}
                            </CustomButton>
                        </CustomCol>
                    </CustomRow>
                    {onToggleSignup && (
                        <CustomRow>
                            <CustomCol s={12} m={10} l={8} offset="m1 l2" className="center">
                                <button
                                    type="button"
                                    className="btn-flat white-text"
                                    onClick={onToggleSignup}
                                    style={{ textTransform: "none", background: "transparent" }}
                                >
                                    {isSignup ? "¿Ya tienes cuenta? Entra aquí" : "¿No tienes cuenta? Regístrate aquí"}
                                </button>
                            </CustomCol>
                        </CustomRow>
                    )}
                    {extraContent}
                </form>
            </CustomRow>
        </div>
    );
};

export default AuthForm;
