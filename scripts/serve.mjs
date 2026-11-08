import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2);
const production=args.includes('--production');
const portIndex=args.indexOf('--port');
const port=Number(portIndex>=0?args[portIndex+1]:process.env.PORT || 5173);
if(!Number.isInteger(port) || port<1 || port>65535)throw new Error('Choose a port between 1 and 65535.');
const root=fileURLToPath(new URL(production?'../dist/':'../site/',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf'};
const server=createServer(async(request,response)=>{
 try{
  if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,{Allow:'GET, HEAD'});response.end();return;}
  const url=new URL(request.url,'http://localhost');
  const pathname=decodeURIComponent(url.pathname);
  const path=resolve(root,'.'+pathname);
  if(path!==resolve(root) && !path.startsWith(resolve(root)+sep)){response.writeHead(403);response.end('Forbidden');return;}
  let file=path;
  if((await stat(file)).isDirectory()){
   if(!url.pathname.endsWith('/')){response.writeHead(301,{Location:url.pathname+'/'+url.search});response.end();return;}
   file=resolve(file,'index.html');
  }
  const content=await readFile(file);
  response.writeHead(200,{'Content-Type':types[extname(file)] || 'application/octet-stream','Content-Length':content.length,'Cache-Control':'no-store'});
  response.end(request.method==='HEAD'?undefined:content);
 }catch(error){response.writeHead(error instanceof URIError?400:404,{'Content-Type':'text/plain; charset=utf-8'});response.end(error instanceof URIError?'Bad request':'Not found');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Try --port ${port+1}.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio preview: http://127.0.0.1:${port}/ (${production?'production build':'editable source'})`));
