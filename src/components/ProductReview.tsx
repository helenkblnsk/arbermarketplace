import React from 'react';
import { bindActionCreators, Action } from 'redux';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { format } from 'date-fns';
import { capitalizeFirstLetter } from '../utils/index';

// Import actions.
import * as productsActions from '../actions/productsActions';

// Components
import StarsRating from './StarsRating';
import Icon from './Icon';

const styles = EStyleSheet.create({
  reviewContainer: {
    marginTop: 40,
  },
  reviewNameStarsDateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewNameStarsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewName: {
    fontSize: '0.9rem',
    marginRight: 5,
  },
  reviewDate: {
    color: '#8F8F8F',
  },
  reviewCountry: {
    color: '#8F8F8F',
  },
  reviewCommentTitle: {
    fontSize: '0.9rem',
    marginBottom: 10,
  },
  reviewCommentText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#8F8F8F',
  },
  reviewLikesWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    marginRight: 5,
  },
  voteUpWrapper: {
    flexDirection: 'row',
    fontSize: 14,
    alignItems: 'center',
    marginRight: 20,
  },
  voteDownWrapper: {
    flexDirection: 'row',
    fontSize: 14,
    alignItems: 'center',
  },
  likeDislikeIcons: {
    fontSize: 25,
    color: '#d4d4d4',
    marginRight: 5,
  },
  votesCountText: {
    color: '#8F8F8F',
  },
});

interface Review {
  user_data: {
    name: string;
  };
  product_review_timestamp: number;
  rating_value: string;
  country: string;
  message: {
    [key: string]: string;
  };
  helpfulness: {
    vote_up: number;
    vote_down: number;
  };
  product_review_id: number;
}

interface ProductReviewsProps {
  review: Review;
  productId: number;
}

export const ProductReview: React.FC<ProductReviewsProps> = ({
  review,
  productId,
  productsActions,
}) => {
  const reviewDate = format(
    new Date(review.product_review_timestamp * 1000),
    'dd.MM.yyyy',
  );

  const likeDislikeHandler = async (value: string, productReviewId: number) => {
    await productsActions.likeDislikeReview({
      action: value,
      product_review_id: productReviewId,
      productId: productId,
    });
  };

  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewNameStarsDateWrapper}>
        <View style={styles.reviewNameStarsWrapper}>
          <Text style={styles.reviewName}>
            {review.user_data?.name || 'Stranger'}
          </Text>
          <StarsRating
            count={5}
            size={14}
            isDisabled
            value={Number(review.rating_value)}
          />
        </View>
        <Text style={styles.reviewDate}>{reviewDate}</Text>
      </View>
      <Text style={styles.reviewCountry}>{review.country}</Text>
      {Object.keys(review.message).map((el: string, index: number) => {
        if (!review.message[el]) {
          return null;
        }

        return (
          <View key={index}>
            <Text style={styles.reviewCommentTitle}>
              {capitalizeFirstLetter(el)}
            </Text>
            <Text style={styles.reviewCommentText}>{review.message[el]}</Text>
          </View>
        );
      })}
      <View style={styles.reviewLikesWrapper}>
        <TouchableOpacity
          style={styles.voteUpWrapper}
          onPress={() => likeDislikeHandler('up', review.product_review_id)}>
          <Icon name={'thumb-up'} style={styles.likeDislikeIcons} />
          <Text style={styles.votesCountText}>
            {review.helpfulness.vote_up}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.voteDownWrapper}
          onPress={() => likeDislikeHandler('down', review.product_review_id)}>
          <Icon name={'thumb-down'} style={styles.likeDislikeIcons} />
          <Text style={styles.votesCountText}>
            {review.helpfulness.vote_down}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default connect(null, (dispatch) => ({
  productsActions: bindActionCreators(productsActions, dispatch),
}))(ProductReview);
