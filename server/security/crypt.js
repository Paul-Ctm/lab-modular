
const crypto = require('crypto');

/*************************************
************** Cryp.js ***************
*************************************/

/*
*   Module permettant de vérifier les mots de passe en fonctions du hash et du salt
*/


/*  genRandomSting
*   Génère un salt aléatoire
*   Length : taille du salt 
*/
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0,length);
};

/*  sha512
 *  Génère un hash en fonction du salt et du password ajouté
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

/*  passwordToHash
*   Génère le hash et le salt pour le password en paramètre
*/
var passwordToHash = function(password){
    var salt = genRandomString(15);
    var hash = sha512(password, salt);
    return{
        salt:salt,
        hash:hash.passwordHash,
        password:password
    }
}

/*  check
*   Retourne vrai si le password et le salt correspondent au hash
*/
var check = function(password, salt, hash){
    var key = sha512(password,salt).passwordHash;
    return key == hash;
}

/*  isSet
*   Vérifie que l'email et le mot de passe soient en paramètre de la requête
*/
var isSet = function(req){
    return (typeof(req.body.email) != undefined && typeof(req.body.password) != undefined);
}

/*  isSetPwd
*   Vérifie que les deux nouveaux mots de passe sont dans la requête
*/
var isSetPwd = function(req){
    return (typeof(req.body.data.newpass) != undefined && typeof(req.body.data.passconfirm) != undefined && typeof(req.body.data.password) != undefined);
}

exports.genRandomString = genRandomString;
exports.sha512 = sha512;
exports.check = check;
exports.isSet = isSet;
exports.isSetPwd = isSetPwd;
exports.passwordToHash = passwordToHash;