# CMS1 Runbook

## Start Application
```cmd
npm start
```

## Open Frontends
- UC dashboard: `http://localhost:3000/app/`

## UC Scenario Execution
From browser (`/app/`): run each UC scenario button (success first, then alt/fail cases).

## Restart If Port 3000 Is Busy
```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
npm start
```

## Lint
```cmd
npm.cmd run lint
```

## Tests
```cmd
npm test
```

## Coverage
```cmd
npx c8 --all --src backend/src --src frontend/src ^
  --reporter=text --reporter=html ^
  --exclude "**/tests/**" --exclude "tests/**" --exclude "frontend/tests/**" ^
  -- node --test "tests/**/*.js" "frontend/tests/**/*.js"
```
