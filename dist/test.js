const fs = require('fs')
const path = require('path')

const folderPath = __dirname

const isFile = fileName => {
  if(path.extname(fileName) === '.card'){
    if(fileName === path.join(folderPath, 'admin@kychain.card')){
      console.log(typeof(fs.lstatSync(fileName)));
      return fs.lstatSync(fileName).isFile();
    }else{
      console.log('Not this file')
    }
  }
}

try {
  if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath)
  }else{
    fs.readdirSync(folderPath).map(fileName => {
        return path.join(folderPath, fileName)
      }).filter(isFile)  
  }
} catch (err) {
  console.error(err)
}
