# Deploying

Create `secrets.env` under overlays/[staging|production], with these variables set:

```dotenv
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
EVE_CLIENT_ID=
EVE_CLIENT_SECRET=
COOKIE_SECRET=
```

Deploy:

```bash
# staging:
kustomize build overlays/staging | kubectl apply -f -

# production
kustomize build overlays/production | kubectl apply -f -
```

or

```bash
# staging:
kustomize build overlays/staging > staging.yaml
kubectl apply -f ./staging.yaml
```
