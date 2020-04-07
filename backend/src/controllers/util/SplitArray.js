module.exports = function StringToArray(string){
    const array = string.split(',').map(elmt => elmt.trim());
    return array
}; 
