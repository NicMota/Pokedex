import * as React from 'react';
import { ActivityIndicator, Button, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import Wrapper from './Wrapper';
import { FlatList,Image,Dimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { TextInput } from 'react-native-gesture-handler';
import PokemonIcon from '../assets/pokemon-icon.png';
//colors key list according to the pokemon type
const typeColors = {
  fire: '#f08030',
  water: '#6890f0',
  grass: '#78c850',
  bug: '#a8b820',
  normal: '#a8a878',
  flying: '#a890f0',
};

//Pokemon Component 
const PokemonItem = ({name, onPress}) =>
{   
  const [color, setColor] = React.useState('#f67280');
  const [imageUrl, setImageUrl] = React.useState('');
  async function fetchPokemonData(name) // function to get pokemon type to set card color
  {
    try {
      const response =  await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      const mainType = data.types[0]?.type.name || 'normal';
      const color = typeColors[mainType] || '#f67280';
      const imageUrl = data.sprites.front_default;
      setColor(color);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error on fetching type of pokemon:', error);
      return null;
    }
  }
  React.useEffect(()=>
  {
    fetchPokemonData(name);

  },[])
  
  return(
    <Pokemon onPress={onPress} style={{ borderColor: color }}>

      {imageUrl ? <PokemonImage source={{ uri: imageUrl }} /> : null}
       
      <PokemonNameView >
        <PokemonNameText>
          {name}
        </PokemonNameText>
      </PokemonNameView>
    </Pokemon>
  )
}

export default function List(props) {
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredList, setFilteredList] = React.useState([]);

  async function fetchData()
  { 
     try {
      setLoading(true); 
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20'); //get requisition to pokeApi that returns 20 pokemons
      const data = await response.json(); //takes the response in json format
      setList(data.results);  //fill the list array with the results field of the data object ( where the 20 pokemons (name and url) are)
      setFilteredList(data.results);  
    } catch (error) {
      console.error('Error on fetching pokemons list:', error);
    } finally {
      setLoading(false);
    }
    
  }
  const navigation = useNavigation();

    //method that runs when the component is initialized.
  React.useEffect(() => {
    fetchData();
  },[]);

  React.useEffect(() => {
    const filtered = list.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchQuery, list]);

  const screenWidth = Dimensions.get('window').width;


  const CARD_WIDTH = 160 + 16; // width + margin
  const numColumns = Math.floor(screenWidth / CARD_WIDTH);

  return (
    <PokedexWrapper>
       <PokedexTop>
          <PokedexTitle>
            <PokedexText>
              Pokedex Taqtile Project :) 
            </PokedexText>
            <PokemonSymbol source={PokemonIcon}/>
          </PokedexTitle>
          <PokedexFilter>
            <PokedexInput
              placeholderTextColor="#cccccc"
              placeholder="Search for Pokemon's name"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </PokedexFilter>
      </PokedexTop>
      <PokedexDisplay>

        
        {loading ? <ActivityIndicator size={'large'} /> : 

        <FlatList
          data={filteredList}
          keyExtractor={(item) => item.name}
          renderItem={({item}) => 
            <PokemonItem 
                name = {item.name}
                onPress = {()=>navigation.navigate('Details', {name: item.name})}
                width={screenWidth / numColumns - 24}
            />
          }
          numColumns={numColumns}
        />
        }
      </PokedexDisplay>
     
      
    </PokedexWrapper>
  );
}
const PokedexWrapper = styled(View)`
  flex: 1;
  padding-top: ${Constants.statusBarHeight};
  background-color: #f64646ff;
  padding: 8px;
  flex-direction:col;
`
const PokedexTitle = styled(View)`
  flex-direction:row;
  margin:8px;
  align-items:center;
  justify-content:space-between;
`
const PokedexFilter = styled(View)`
  margin-top:5px;
`
const PokedexInput = styled(TextInput)`
  width:100%;
  color:white;
  padding:8px;
  border-radius:12px;
  border-width:1px;
  border-color:black;
  background-color: rgba(67, 101, 64, 1);
  
`
const PokedexTop = styled(View)`
  flex:1;

  margin-top:10px;
`

const PokedexText = styled(Text)`
  color:yellow;
  font-weight:lighter;
  font-size:20px;
`
const PokedexDisplay = styled(View)`
  height:85%;
  
  flex-direction:col;
  padding-top: ${Constants.statusBarHeight};
  background-color: #fffdfdff;
  padding: 8px;
  border-radius:5%;
  
  justify-content:center;
  align-items:center
`
const Pokemon = styled(TouchableOpacity)`
  background-color: white;
  border-radius: 12px;
  flex-direction:col;
  margin-vertical: 8px;
  margin-horizontal:8px;
  align-items: center;
  width: ${(props) => props.width || 160}px;
  justify-content: center;
  border-width: 2px;
  justify-content: space-between;
  height: 180px;
  shadow-color: black;
  shadow-opacity: 0.1;
  shadow-radius: 4px;

`;

const PokemonNameView = styled(View)`
  
  background-color: #efe0e08c;
  flex-direction:column;
  width:100%;
  position:absolute;
  bottom:0;
  z-index:1;
  height:50%;
  text-align:center;
  padding:8px;
  border-radius:12px;
  align-items: center;
  justify-content:flex-end;
`;
const PokemonNameText = styled(Text)`
  font-size: 15px;
  color: black;
  font-weight: bold;
  text-align:end;
  text-transform: capitalize;
  
`
const DetailsButton = styled(TouchableOpacity)`
  background-color: #355c7d;
  padding: 10px 16px;
  border-radius: 10px;
`;

const ButtonText = styled(Text)`
  color: white;
  font-weight: bold;
  text-align: center;
`;

const PokemonImage = styled(Image)`
  width: 156px;
  height: 156px;
  margin-bottom: 2px;
  z-index:2;

`;
const PokemonSymbol =styled(Image)`
  width: 32px;
  height: 32px;
`