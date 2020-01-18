const fetch = require("node-fetch");
const fs = require('fs');
const crypto = require('crypto');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

exports.getPokemon = function getPokemon(name) {
	
	// Reading Input.
	const localName = name;
	
	// Validating Input.
	const re = new RegExp('^[a-zA-Z]+$');
	if (re.test(localName) == false){
		console.log('Bad Input');
		return notFound();
	}
	
	else {
		
		// Cleaning Input.
		const localNameClean = localName.replace(/^\w/, c => c.toUpperCase());
		console.log('Cleaned Name: ' + localNameClean);
		
		
		// Reading Whitelist of Pokemons.
		const fileUrl = 'backend/GetPokemon/PokemonList.txt';
		const encoding = 'utf-8';
		const dataString = fs.readFileSync(fileUrl, encoding); // blocks here until file is read
		
		// Checking Integrity of PokemonList.
		var SHA512Integrity = '22a3489f63b471e068424242073a70bfea19604a8c1024683752c366ea23264fc40af1d80b7a8b9d094e5e4b8fa663b0ff40ba07c8ec30ca15b13a29a530018f';
		var rehash = crypto.createHash('sha512').update(dataString).digest('hex');
		if (SHA512Integrity == rehash){
			console.log("Integrity of Pokemon List Untouched");
		}
		else {
			return notFound();
		}
		
		// Prep for External API.
		const dataStringClean = dataString.replace(/[\n\r]/g, '');
		const dataArray = dataStringClean.split(",");

		var i;
		// console.log('Name to be found: ' + localNameClean)
		for (i = 0; i < dataArray.length; i++) {
			
			// console.log('Reading Pokemon: ' + dataArray[i])
		
			if (localNameClean == dataArray[i]){
				// console.log('Founded in list: ' + dataArray[i])
				// const localNameCleanV2 = localName.replace(/^\w/, c => c.toLowerCase());
				return lookUp(localNameClean);
				break;
			}
			
		}
	}
	
	function lookUpV2(localNameClean){
	  P.getPokemonByName(localNameClean) // with Promise
      .then(function(response) {
        console.log(response);
    })
    .catch(function(error) {
      console.log('There was an ERROR: ', error);
    });
	}

	function lookUp(localNameClean) {
					
		/*
			opensearch.js
			MediaWiki API Demos
			Demo of `Opensearch` module: Search the wiki and obtain
			results in an OpenSearch (http://www.opensearch.org) format
			MIT License
		*/

		var url = "https://bulbapedia.bulbagarden.net/w/api.php"; 

		const params = {
			action: "opensearch",
			search: localNameClean,
			limit: "5",
			namespace: "0",
			format: "json"
		};

		url = url + "?origin=*";
		Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
		
		console.log('URL sending ' + url);
		console.log('Parameter used for API Call: ' + localNameClean);
		
		result = fetch(url)
		  .then(response => response.json())
		  .catch(error => console.log(error));
		 
		return result;
	}

	function notFound() {
			
		result = new Promise(function(resolve, reject) {
			setTimeout(function() {
			resolve('Pokemon not found');
			}, 300);
		});
		result.then(function(value) {
			// console.log(value);
		});
		
		return result;

	}
}