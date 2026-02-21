# CMS1 Runbook

## Start Application
```cmd
npm start
```

## Open Frontends
- UC dashboard: `http://localhost:3000/app/`
- API tester: `http://localhost:3000/appsimple/`

## Seed Demo Data (for repeatable UC flows)
From browser (`/app/`): click `Seed Demo Data`.

Or via terminal:
```cmd
curl -X POST http://localhost:3000/api/v1/dev/seed-demo
```

## Run All UC Actions
From browser (`/app/`): click `Run All UCs`.

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
