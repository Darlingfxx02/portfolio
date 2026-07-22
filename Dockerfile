# Emergency offline production image.
#
# The Coolify host currently cannot reach Docker Hub or mirror.gcr.io. Reuse
# the locally cached image of the last healthy portfolio release (it already
# contains nginx plus nginx.conf) and replace only the prebuilt static files.
# Once registry access is restored, return to the normal multi-stage build.
FROM c13rpk2ur1auqxemoctj77vp:bfd2d44cb76b38797053fe01cb78fb4d965c018b

COPY dist /usr/share/nginx/html
