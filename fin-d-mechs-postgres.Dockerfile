FROM postgres:latest
RUN sed -i -e 's/# es_ES.UTF-8 UTF-8/es_ES.UTF-8 UTF-8/' /etc/locale.gen && \
locale-gen
ENV LANG: "en_US.utf8"
ENV LANGUAGE: "en_US.utf8"
ENV LC_ALL: "es_ES.utf8"
