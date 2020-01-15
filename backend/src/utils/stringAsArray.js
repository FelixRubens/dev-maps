module.exports = function stringAsArray(string) { 
    return string.split(',').map((tech) => tech.trim()) 
}