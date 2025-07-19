import React from 'react';
import { View, Text, Image, TouchableOpacity, Share, Alert} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { typeColors,buttonTypeColors } from '../lib/colors';


const MAX_STAT = 100;

const StatBar = ({statname,value,type}) =>
{
    const widthPercent = Math.min((value / MAX_STAT) * 100, 100);

     return (
        <StatRow>
            <StatLabel>{statname}</StatLabel>
            <BarContainer>
                <FilledBar style={{ width: `${widthPercent}%`,backgroundColor:typeColors[type]}} />
            </BarContainer>

            <StatValue>{value}</StatValue>
        </StatRow>
    );


}
export default function Details({route})
{
    const [data,setData] = React.useState(null);
    const {name} = route.params;
    const navigation = useNavigation();

    const linkToDetails = `https://localhost:8081/details/${name.toLowerCase()}`;

    async function fetchPokemonData(name) // function to get pokemon type to set card color
    {
        try {
            const response =  await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Error on fetching type of pokemon:', error);
            return null;
        }
    }
    async function onShare()
    {
        try{
            const result = await Share.share({
                message:
                `Check out this Pokémon From Taqtile Pokedex ;)!\n\n`+
                `${name.toUpperCase()}\n\n`+
                `Height: ${data.height/10} m\n` +
                `Weight: ${data.weight/10} kg\n`+
                `Base stats:\n`+
                `Hp: ${data.stats[0].base_stat}\n`+
                `Attack: ${data.stats[1].base_stat}\n`+
                `Defense: ${data.stats[2].base_stat}\n\n`+ 
                `🔗 More info: ${linkToDetails}\n\n `,     
            })
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type of result:', result.activityType);
                } else {
                    console.log('Shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }

        }catch(err)
        {
            Alert.alert(error.message);
        }
    }
    React.useEffect(()=>{
        fetchPokemonData(name);
    },[name]);
    React.useLayoutEffect(() => {
        navigation.setOptions({ title: name });
    }, [navigation, name]);
    var types,mainType;
    if(data!=null){
       types = data?.types;
       mainType = types[0]?.type?.name || 'normal';
    }

    
    return (
        <DetailsWrapper style={{backgroundColor:typeColors[mainType]}}>

            <Badges>
                {types?.map((typeObj,index)=>(
                    <Badge style={{backgroundColor:buttonTypeColors[typeObj.type.name]}}key={index}>
                        {typeObj.type.name}
                    </Badge>
                ))}
            
            </Badges>
            {data?.sprites? 
                <ImageConteiner>
                     <PokemonImage source={{uri:data.sprites.other['official-artwork'].front_default}}/> 
                </ImageConteiner>
                :  null 
                
            }
            {data?
            <InfoDisplay>
                <HeightAndWeight>
                    <Height>
                        <StatText>{data.height/10} m  </StatText>
                        <Label>HEIGHT</Label>
                    </Height>
                    <Weight>
                        <StatText>{data.weight/10} kg </StatText>
                        
                        <Label>WEIGHT</Label>
                    </Weight>
                </HeightAndWeight>
                <BaseStats>
                    <BaseStatsText> Base stats </BaseStatsText>
                    <Stats>
                        <StatBar statname="Hp" value={data.stats[0].base_stat} type={mainType} />
                        <StatBar statname="Attack" value={data.stats[1].base_stat} type={mainType} />
                        <StatBar statname="Defense" value={data.stats[2].base_stat}  type={mainType}/>
                    </Stats>
                    <ShareButton onPress={onShare} style={{backgroundColor:buttonTypeColors[mainType]}}>
                        <ShareText>Share</ShareText>
                    </ShareButton>
                </BaseStats>
                
            </InfoDisplay>: null
            }
           
        </DetailsWrapper>
    );
}

const Badges = styled(View)`
    flex-direction:row;
    margin:5px;
    margin-left:20px;
    
`
const Badge = styled(Text)`
    padding:10px;
    border-radius:12px;
    font-weight:lighter;
    
    margin-right:8px;
    color:white;
    text-transform:capitalize;
    border-width:.5px;
    border-color:black;

`

const ShareButton = styled(TouchableOpacity)`
    border-radius:12px;
    padding:12px;
    align-items:center;
`
const ShareText = styled(Text)`
    font-weight:lighter;
    font-size:25px;
    color:white;

    
`

const InfoDisplay = styled(View)`
    flex:1;
    background-color: #ffffffff;
    border-top-left-radius: 7.5%;
    border-top-right-radius: 7.5%;
    padding:15px;
    margin-top: -50px;
    z-index: 1;
`

const HeightAndWeight = styled(View)`
    flex-direction: row;
    width:100%;
    margin-top:35px;
    margin-bottom:15px;
`
const Height = styled(View)`
    flex-direction: column;
    width:50%;
    border-right-width: 1px;
    border-right-color: black;
    justify-content:center;
    align-self:center;
`
const Weight = styled(View)`
    flex-direction: column;
    width:50%;
   
    justify-content:center;
    align-self:center;
`
const StatText = styled(Text)`
    font-size:40px;
    font-weight: bold;
    align-self:center;
    color: black;
`;
const Label = styled(Text)`
    font-size:15px;
    align-self:center;
`
const ImageConteiner=  styled(View)`
    align-items: center;
    margin-top:20%;
    z-index: 2;
`
const DetailsWrapper = styled(View)`
    flex: 1;
    padding-top:20px;
    background-color: #ffffffff;
`;


const PokemonImage = styled(Image)`
    width: 256px;
    height: 256px;

`;
const BaseStats = styled(View)`
    flex:1;
  
    justify-content:space-evenly;
`;
const BaseStatsText = styled(Text)`
    font-weight:lighter;
    font-size:20px;
    
`
const Stats = styled(View)`
    
`

const StatRow = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-vertical: 8px;
`;

const StatLabel = styled(Text)`
    width: 60px;
    font-size: 14px;
`;

const BarContainer = styled(View)`
    flex: 1;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-horizontal: 8px;
`;

const FilledBar = styled(View)`
    height: 100%;
  
`;

const StatValue = styled(Text)`
    width: 30px;
    font-size: 14px;
    text-align: right;
`;