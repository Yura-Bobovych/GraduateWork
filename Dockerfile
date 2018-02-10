
FROM microsoft/aspnetcore:1
LABEL Name=graduatework Version=0.0.1
ARG source=.
WORKDIR /app
EXPOSE 3000
COPY $source .
ENTRYPOINT dotnet graduatework.dll
