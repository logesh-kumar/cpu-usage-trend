# cpu-usage-trend

- src/background.ts - gets cpu usage metrics and passes to content.ts
- src/content.ts - Save the cpu metrics in indexdb 


# To install the extension,  

1. Install pnpm https://pnpm.io/installation
2. Run pnpm install
3. Run pnpm build. 'dist' folder will be generated
4. Navigate to chrome extensions page
5. Toggle on developer mode switch in top right corner
6. click load unpacked in top left corner and upload the 'dist' folder
