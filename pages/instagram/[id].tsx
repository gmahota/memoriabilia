import console from 'console';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import {
    Memories,
    getMemorie
} from '../../assets/data/memories'

import { MemorieCard } from "../../components/Card"
import { Parallax, ImageGridList,GridContainer, GridItem } from "../../components/templates"

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

// Naterial Ui-Import
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { container } from "../../assets/jss/nextjs-material-kit.js";
import Moment from 'react-moment';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
      container,
      brand: {
      color: "#FFFFFF",
      textAlign: "left"
    },
    title: {
      fontSize: "4.2rem",
      fontWeight: 600,
      display: "inline-block",
      position: "relative"
    },
    subtitle: {
      fontSize: "1.313rem",
      maxWidth: "510px",
      margin: "10px 0 0"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    gridList: {
        width: 500,
        height: 450,
        paddingTop:20
      }
  }),
);

type PropsButton = {
    nextImage?: any
    previousImage?: any
}

export default function Member({ memorie }) {
    const [currentSlide, setCurrentSlide] = useState(0)

    const classes = useStyles();

    const { isFallback } = useRouter();

    if (isFallback) {
        return <p>Carregando...</p>;
    }

    // State transitions
    var actions = {
        toggleNext: function (): void {

            var current = currentSlide;
            var next = current + 1;
            if (next > memorie.sentences.length - 1) {
                next = 0;
            }
            setCurrentSlide(next);
        },
        togglePrev: function (): void {
            var current = currentSlide;
            var prev = current - 1;
            if (prev < 0) {
                prev = memorie.sentences.length - 1;
            }
            setCurrentSlide(prev);
        },
        toggleSlide: function (id: string): void {

            var index = memorie.sentences.map(function (el) {
                return (
                    el.id
                );
            });
            var currentIndex = index.indexOf(id);
            setCurrentSlide(currentIndex);
        }
    }

    const BackArrow = (props: PropsButton) => (
        <div onClick={props.previousImage} style={{ fontSize: '2em', marginLeft: '12px' }}>
            <i className="fa fa-angle-left fa-2x" aria-hidden="true"></i>
        </div>
    )

    const NextArrow = (props: PropsButton) => (
        <div onClick={props.nextImage} style={{ fontSize: '2em', marginLeft: '12px' }}>
            <i className="fa fa-angle-right fa-2x" aria-hidden="true"></i>
        </div>
    )
    
    const dateToFormat = new Date(memorie.date);
    
    var imagesData = getAllImages(memorie);

    return (
        <div>

            <div className={classes.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',marginTop: '10px',marginBottom:'20px', position:'relative' }}>
                
                <p>  Like Instagram, Atenção é um esboço da versão final seguindo esta linha</p>
                <p> Seguindo a ideia da imagem com um scroll, Atenção é um esboço da versão final seguindo esta linha</p>
            
            </div>

            <div className={classes.container} style={{ display: 'flex'}}>
                <ImageGridList  imageData = {imagesData} />
            </div>
        
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    //const response = await fetch(`https://api.github.com/orgs/rocketseat/members`);
    //const data = await response.json();

    const paths = Memories.map(memories => {
        return { params: { id: memories.id.toString(), } }
    });

    return {
        paths,
        fallback: true
    }


}

export const getStaticProps: GetStaticProps = async (context) => {

    const { id } = context.params;

    //const response = await fetch(`https://api.github.com/users/${login}`);
    //const data = await response.json();

    const memorie = getMemorie(id);

    return {
        props: {
            memorie: memorie
        },
        revalidate: 10,
    }
}

const getAllImages = function(memorie:any){
    try{
        const images = [];

        memorie.sentences.map((sentence, key) => {
            sentence.images.map((image,key)=>{
                images.push({
                    img:image,
                    title:sentence.keywords[0]
                })
            })
        });

        return images;
    }catch(e){

    }
}

