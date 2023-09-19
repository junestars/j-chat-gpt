#### server 为服务项目

​		执行 npm i & node index.js 启动

​		可在 processEnv.mjs 配置 open api key

​		如果 processEnv.mjs 中配置的 key 会在鉴权通过时，在接口返回



​		新增了短信验证码相关配置，详见 ./processEnv.mjs

#### ChatGPT-Next-Web 为 web 项目

​		执行 npm i & npm run dev 启动

​		可在 .env.development 中配置以下配置

​    			NEXT_PUBLIC_NODE_SERVER_BASE_URL：服务地址，必须要配置

   			 OPENAI_API_KEY：open api key, 可选

​	

open api key 在 processEnv.mjs 和 .env.development 配置其一即可，会优先使用 processEnv.mjs 中的配置