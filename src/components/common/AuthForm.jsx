import { useActionState, startTransition } from "react";
import CustomButton from "../custom/CustomButton";
import CustomRow from "../custom/CustomRow";
import CustomCol from "../custom/CustomCol";
import CustomTextInput from "../custom/CustomTextInput";
import CustomIcon from "../custom/CustomIcon";

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
                    {error && (
                        <CustomRow>
                            <CustomCol s={12} m={10} l={8} offset="m1 l2">
                                <p className="red-text center-align valign-wrapper" role="alert" aria-live="assertive" style={{ justifyContent: 'center' }}>
                                    <CustomIcon tiny className="red-text">highlight_off</CustomIcon>
                                    <span style={{ marginLeft: '8px' }}>{error}</span>
                                </p>
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
                                    style={{ textTransform: 'none', background: 'transparent' }}
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
