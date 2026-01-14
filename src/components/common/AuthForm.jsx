import React, { useActionState, startTransition } from "react";
import CustomButton from "../custom/CustomButton";
import CustomRow from "../custom/CustomRow";
import CustomCol from "../custom/CustomCol";
import CustomTextInput from "../custom/CustomTextInput";

const AuthForm = ({
    title,
    action,
    isSignup = false,
    onToggleSignup = null,
    extraContent = null,
    submitText = "Entrar",
    isPendingText = "Entrando...",
}) => {
    const [error, submitAction, isPending] = useActionState(action, null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => {
            submitAction(formData);
        });
    };

    return (
        <div className="container section">
            <CustomRow className="z-depth-2 green darken-4">
                <form onSubmit={handleSubmit} className="col s12 m12">
                    <h2 className="center white-text hide-on-small-only">{title}</h2>
                    <h4 className="center white-text hide-on-med-and-up">{title}</h4>
                    <CustomRow>
                        {isSignup && (
                            <CustomCol s={10} offset="s2">
                                <CustomTextInput
                                    label="Nombre"
                                    id="name"
                                    name="name"
                                    inputClassName="white-text"
                                    validate
                                    required
                                />
                            </CustomCol>
                        )}
                        <CustomCol s={12} m={10} l={8} offset="m1 l2">
                            <CustomTextInput
                                label="email"
                                id="email"
                                name="email"
                                type="email"
                                inputClassName="white-text"
                                validate
                                required
                            />
                        </CustomCol>
                        <CustomCol s={12} m={10} l={8} offset="m1 l2">
                            <CustomTextInput
                                type="password"
                                label="password"
                                id="password"
                                name="password"
                                autocomplete={isSignup ? "new-password" : "current-password"}
                                inputClassName="white-text"
                                validate
                                required
                            />
                        </CustomCol>
                    </CustomRow>
                    {error && (
                        <CustomRow>
                            <CustomCol s={12} m={10} l={8} offset="m1 l2">
                                <p className="red-text center-align">{error}</p>
                            </CustomCol>
                        </CustomRow>
                    )}
                    <CustomRow className="section center">
                        <CustomCol s={12} m={10} l={8} offset="m1 l2">
                            <CustomButton
                                type="submit"
                                large
                                waves="light"
                                className="grey lighten-3 green-text"
                                disabled={isPending}
                            >
                                {isPending ? isPendingText : submitText}
                            </CustomButton>
                        </CustomCol>
                    </CustomRow>
                    {onToggleSignup && (
                        <CustomRow>
                            <CustomCol s={12} m={10} l={8} offset="m1 l2" className="center">
                                <a href="#!" className="white-text" onClick={(e) => { e.preventDefault(); onToggleSignup(); }}>
                                    {isSignup ? "¿Ya tienes cuenta? Entra aquí" : "¿No tienes cuenta? Regístrate aquí"}
                                </a>
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
