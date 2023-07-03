import React, {useState} from "react";
import ReactDOM from "react-dom";
import ImageUploading from "react-images-uploading";
import Button from "@mui/material/Button";
import Image from "next/image";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";


export function UploadImage({image}) {
    const [images, setImages] =useState(null);
    const [open, setOpen] = React.useState(false);
    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        setImages(imageList);
        image(imageList[0].file)
    };


    return (
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={1}
                dataURLKey="data_url"
                acceptType={["jpg","png","jpeg"]}
            >
                {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps
                  }) => (
                    // write your building UI
                    <Box sx={{ margin:1}}>
                        {open?null:
                        <Button
                            variant="contained"
                            sx={{
                                marginTop:4
                            }}
                            style={isDragging ? { color: "red" } : null}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            Ajouter image
                        </Button>
                        }
                        &nbsp;
                        {imageList.map((image, index) => (
                            <Box sx={{ margin:1,boxShadow:3}}>
                                <Image src={image.data_url} width={185} height={160} />
                                <div className="image-item__btn-wrapper">
                                    <Button  sx={{height:25,width:100}} variant="contained" onClick={() => onImageUpdate(index)}>Modifier</Button>
                                </div>
                            </Box>
                        ))}
                    </Box>
                )}
            </ImageUploading>
        </FormControl>
    );
}
