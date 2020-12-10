import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import { Form, Input } from 'formsy-react-components';
import FormsyImageUploader from './FormsyImageUploader';
import LoaderButton from './LoaderButton';
import GridItem from './Grid/GridItem';

const ProfileForm = ({ user, isSaving, onSubmit, showSubmit = true, showCompact=false }) => {
    
    const [isPristine, setIsPristine] = useState(true);
    const [image, setImage] = useState("");

    useEffect(() => {
        user.newAvatar = image;
    }, [image])

    const saveDisabled = isSaving || isPristine || (user && user.giverId === 0);

    const columnWidth = showCompact? 6: 12 ;   

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
            <Box style={{ marginLeft:-15,marginRight:-15 }}>
                <Grid container direction="row">
                    <GridItem xs={12} sm={12} md={columnWidth}>
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
                    </GridItem>

                    <GridItem xs={12} sm={12} md={columnWidth}>
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
                    </GridItem>
                </Grid>
            </Box>
            

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

            {showSubmit &&
                (<div className="form-group">
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
                </div>)
            }
            
        </Form>
    )
}

export default ProfileForm;





