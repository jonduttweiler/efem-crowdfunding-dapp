import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Form, Input } from 'formsy-react-components';
import FormsyImageUploader from '../FormsyImageUploader';
import LoaderButton from '../LoaderButton';

const FormProfile = ({ user, isSaving, onSubmit }) => {

    const [isPristine, setIsPristine] = useState(true);
    const [image, setImage] = useState("");

    useEffect(()=>{ 
        user.newAvatar = image;
    },[image])

    const saveDisabled = isSaving || isPristine || (user && user.giverId === 0);

    return (
        <Form
            onSubmit={() => onSubmit(user)}
            mapping={inputs => {
                user.name = inputs.name;
                user.email = inputs.email;
                user.url = inputs.url;
            }}
            onChange={(currentValues, isChanged) => setIsPristine(!isChanged)}
            layout="vertical"
        >
            <div className="form-group">
                <Input
                    name="name"
                    autoComplete="name"
                    id="name-input"
                    label="Your name"
                    type="text"
                    value={user.name}
                    placeholder="John Doe."
                    validations="minLength:3"
                    validationErrors={{ minLength: 'Please enter your name', }}
                    required
                    autoFocus
                />
            </div>

            <div className="form-group">
                <Input
                    name="email"
                    autoComplete="email"
                    label="Email"
                    value={user.email}
                    placeholder="email@example.com"
                    validations="isEmail"
                    help="Please enter your email address."
                    validationErrors={{ isEmail: "Oops, that's not a valid email address.", }}
                />
            </div>

            <FormsyImageUploader
                setImage={setImage}
                avatar={user.avatar}
                aspectRatio={1}
            />

            <div className="form-group">
                <Input
                    name="url"
                    label="Your Profile"
                    type="text"
                    value={user.url}
                    placeholder="Your profile url"
                    help="Provide a link to some more info about you, this will help to build trust. You could add your linkedin profile, Twitter account or a relevant website."
                    validations="isUrl"
                    validationErrors={{
                        isUrl: 'Please enter a valid url',
                    }}
                />
            </div>

            <div className="form-group">
                <Box my={2} display="flex" justifyContent="flex-end">
                    <Box>
                        <LoaderButton
                            color="primary"
                            className="btn btn-info"
                            formNoValidate
                            type="submit"
                            disabled={saveDisabled}
                            isLoading={isSaving}
                            loadingText="Saving..."
                        >
                            Save profile
                        </LoaderButton>
                    </Box>
                </Box>
            </div>
        </Form>
    )
}

export default FormProfile;





