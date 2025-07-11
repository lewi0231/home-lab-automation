# Admin Access Setup

## Environment Variables

Add these to your `.env.local` file:

```bash
# Admin Access Control
ADMIN_ENABLED=true
ADMIN_ACCESS_KEY=your-secret-access-key-here
```

## How It Works

1. **Environment Control**: Set `ADMIN_ENABLED=false` to completely disable admin access
2. **Access Key**: Use `ADMIN_ACCESS_KEY` to set a secret key for access
3. **Simple Protection**: No complex auth system needed

## Security Features

- ✅ **Environment-based**: Can be disabled via env var
- ✅ **Secret key**: Simple but effective protection
- ✅ **No database**: No user accounts to manage
- ✅ **Easy to change**: Just update the environment variable

## Usage

1. Set the environment variables
2. Visit `/admin`
3. Enter your access key
4. Access the admin interface

## Cloudflare Considerations

Since you're using Cloudflare as a proxy, this approach works well because:

- The protection happens at the application level
- No need to configure Cloudflare rules
- Works regardless of your hosting setup
