package handler

import (
	"net/http"

	"github.com/src-d/code-annotation/server/repository"
	"github.com/src-d/code-annotation/server/serializer"
)

// GetFilePairDetails returns a function that returns a *serializer.Response
// with the details of the requested FilePair
func GetFilePairDetails(repo *repository.FilePairs) RequestProcessFunc {
	return func(r *http.Request) (*serializer.Response, error) {
		pairID, err := urlParamInt(r, "pairId")
		if err != nil {
			return nil, err
		}

		filePair, err := repo.GetByID(pairID)
		if err != nil {
			return nil, err
		}

		if filePair == nil {
			return nil, serializer.NewHTTPError(http.StatusNotFound, "no file-pair found")
		}

		return serializer.NewFilePairResponse(filePair), nil
	}
}

// GetFilePairs returns a function that returns a *serializer.Response
// with the list of file pairs for the given experiment ID
func GetFilePairs(repo *repository.FilePairs) RequestProcessFunc {
	return func(r *http.Request) (*serializer.Response, error) {
		experimentID, err := urlParamInt(r, "experimentId")
		if err != nil {
			return nil, err
		}

		filePairs, err := repo.GetAll(experimentID)
		if err != nil {
			return nil, err
		}

		return serializer.NewListFilePairsResponse(filePairs), nil
	}
}
