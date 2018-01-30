import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import i18n from '../utils/i18n';
import Icon from './Icon';

const styles = EStyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
    marginLeft: -10,
    marginTop: -4,
  },
  checkIcon: {
    color: '$ratingStarsColor',
    fontSize: '1rem',
  },
  countText: {
    color: 'gray',
    marginLeft: 10,
  },
});


const Rating = ({ value, count, containerStyle }) => {
  const stars = [];
  const currentRating = Math.round(value);

  if (value === '') {
    return null;
  }

  for (let i = 1; i <= currentRating; i += 1) {
    stars.push(<Icon key={`star_${i}`} name="star" style={styles.checkIcon} />);
  }

  for (let r = stars.length; r <= 4; r += 1) {
    stars.push(<Icon key={`star_border_${r}`} name="star-border" style={styles.checkIcon} />);
  }

  return (
    <View
      style={[styles.container, containerStyle]}
    >
      {stars}
      <Text style={styles.countText}>
        {count ? i18n.gettext('{{count}} reviews').replace('{{count}}', count) : ''}
      </Text>
    </View>
  );
};

Rating.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  count: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  containerStyle: PropTypes.number,
};

export default Rating;
